$(function () {
  var issuer = window.location.host; // newchess.fun
  var user = $(document.body).data('user');
  var secret = $('input[name=secret]').val();
  new QRCode(document.getElementById('qrcode'), {
    text: 'otpauth://totp/' + issuer + ':' + user + '?secret=' + secret + '&issuer=' + issuer,
  });
});
