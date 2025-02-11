import { Chess } from 'chessops-newchess1-mod/chess';
import { INITIAL_FEN, makeFen, parseFen } from 'chessops-newchess1-mod/fen';
import { makeSan, parseSan } from 'chessops-newchess1-mod/san';
import { makeSquare, makeUci, parseUci } from 'chessops-newchess1-mod/util';
import { scalachessCharPair } from 'chessops-newchess1-mod/compat';
import { TreeWrapper } from 'tree';
import { Move } from 'chessops-newchess1-mod/types';

export function pgnToTree(pgn: San[]): Tree.Node {
  const pos = Chess.default();
  const root: Tree.Node = {
    ply: 0,
    id: '',
    fen: INITIAL_FEN,
    children: [],
  } as Tree.Node;
  let current = root;
  pgn.forEach((san, i) => {
    const move = parseSan(pos, san)!;
    pos.play(move);
    const nextNode = makeNode(pos, move, i + 1, san);
    current.children.push(nextNode);
    current = nextNode;
  });
  return root;
}

export function mergeSolution(root: TreeWrapper, initialPath: Tree.Path, solution: Uci[], pov: Color): void {
  const initialNode = root.nodeAtPath(initialPath);
  const pos = Chess.fromSetup(parseFen(initialNode.fen).unwrap()).unwrap();
  const fromPly = initialNode.ply;
  const nodes = solution.map((uci, i) => {
    const move = pos.normalizeMove(parseUci(uci)!);
    const san = makeSan(pos, move);
    pos.play(move);
    const node = makeNode(pos, move, fromPly + i + 1, san);
    if ((pov == 'white') == (node.ply % 2 == 1)) node.puzzle = 'good';
    return node;
  });
  root.addNodes(nodes, initialPath);
}

const makeNode = (pos: Chess, move: Move, ply: number, san: San): Tree.Node => ({
  ply,
  san,
  fen: makeFen(pos.toSetup()),
  id: scalachessCharPair(move),
  uci: makeUci(move),
  check: pos.isCheck() ? makeSquare(pos.toSetup().board.kingOf(pos.turn)!) : undefined,
  children: [],
});
