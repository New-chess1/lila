import * as xhr from 'common/xhr';
import NewChessChat from 'chat';

window.NewChessChat = NewChessChat;

interface TeamOpts {
  id: string;
  socketVersion: number;
  chat?: any;
}

export default function (opts: TeamOpts) {
  lichess.socket = new lichess.StrongSocket('/team/' + opts.id, opts.socketVersion);

  if (opts.chat) lichess.makeChat(opts.chat);

  $('#team-subscribe').on('change', function (this: HTMLInputElement) {
    $(this)
      .parents('form')
      .each(function (this: HTMLFormElement) {
        xhr.formToXhr(this);
      });
  });
}
