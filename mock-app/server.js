const http = require('http');

const port = Number(process.env.MOCK_PORT || 4173);
const users = new Map();
const sessions = new Set();
const latestOtp = new Map();

function send(response, status, body, type = 'text/html') {
  response.writeHead(status, { 'Content-Type': `${type}; charset=utf-8` });
  response.end(body);
}

function page(title, content) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>
  <style>body{font:16px Arial;max-width:560px;margin:40px auto;padding:20px}label{display:block;margin-top:12px}input,button{font:16px;padding:8px;margin-top:4px}button{cursor:pointer}.error{color:#b00020}.success{color:#087f23}nav{display:flex;gap:8px;margin-bottom:20px}</style></head><body>${content}</body></html>`;
}

function formPage(message = '') {
  return page('Mock OTP authentication', `<h1>Mock OTP authentication</h1>
    <p>This local-only environment accepts OTP <strong>123456</strong>.</p>
    <nav><button onclick="show('login')">Login</button><button onclick="show('register')">Register</button></nav>
    <section id="auth"><label>Identifier<input id="identifier" name="identifier" placeholder="Email or mobile"></label>
    <label>Delivery method<select id="channel"><option value="email">Email</option><option value="whatsapp">WhatsApp</option></select></label>
    <button onclick="requestOtp()">Request OTP</button><p id="message" class="${message ? 'error' : ''}">${message}</p></section>
    <section id="otp" hidden><label>OTP<input id="otpInput" name="otp" inputmode="numeric"></label>
    <button onclick="verifyOtp()">Verify OTP</button><button onclick="resendOtp()">Resend OTP</button><p id="otpMessage"></p></section>
    <script>
      let mode='login'; let identifier=''; let resendCount=0;
      function show(next){mode=next;document.getElementById('message').textContent='Mode: '+next;}
      async function requestOtp(){
        identifier=document.getElementById('identifier').value.trim();
        if(!identifier){return set('message','Identifier is required','error')}
        if(!identifier.includes('@') && !/^\\+?[0-9]{10,15}$/.test(identifier)){return set('message','Enter a valid email or mobile number','error')}
        const r=await fetch('/api/otp/request',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({identifier,channel:document.getElementById('channel').value,mode})});
        const d=await r.json(); set('message',d.message,d.success?'success':'error'); if(d.success)document.getElementById('otp').hidden=false;
      }
      async function verifyOtp(){
        const otp=document.getElementById('otpInput').value;
        const r=await fetch('/api/otp/verify',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({identifier,otp,mode})});
        const d=await r.json(); set('otpMessage',d.message,d.success?'success':'error'); if(d.success)location.href='/account';
      }
      async function resendOtp(){resendCount++; const r=await fetch('/api/otp/resend',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({identifier})}); const d=await r.json(); set('otpMessage',d.message,d.success?'success':'error');}
      function set(id,text,kind){const e=document.getElementById(id);e.textContent=text;e.className=kind||'';}
    </script>`);
}

function json(request, callback) {
  let body = ''; request.on('data', chunk => { body += chunk; });
  request.on('end', () => { try { callback(JSON.parse(body || '{}')); } catch { callback({}); } });
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  if (request.method === 'GET' && url.pathname === '/') return send(response, 200, formPage());
  if (request.method === 'GET' && url.pathname === '/account') {
    return sessions.size ? send(response, 200, page('Account', '<h1>Customer account</h1><p data-testid="authenticated">Authenticated customer</p><a href="/logout">Logout</a>')) : send(response, 302, '', 'text/plain');
  }
  if (request.method === 'GET' && url.pathname === '/logout') { sessions.clear(); return send(response, 200, page('Logged out', '<h1>Logged out</h1><a href="/">Return to login</a>')); }
  if (request.method === 'POST' && url.pathname === '/api/otp/request') return json(request, data => {
    if (data.mode === 'login' && !users.has(data.identifier)) return send(response, 404, JSON.stringify({ success: false, message: 'User not found' }), 'application/json');
    latestOtp.set(data.identifier, { otp: '123456', attempts: 0, expired: false });
    send(response, 200, JSON.stringify({ success: true, message: `OTP sent by ${data.channel}` }), 'application/json');
  });
  if (request.method === 'POST' && url.pathname === '/api/otp/resend') return json(request, data => {
    if (!latestOtp.has(data.identifier)) return send(response, 400, JSON.stringify({ success: false, message: 'Request OTP first' }), 'application/json');
    latestOtp.set(data.identifier, { otp: '123456', attempts: 0, expired: false });
    send(response, 200, JSON.stringify({ success: true, message: 'A new OTP was sent' }), 'application/json');
  });
  if (request.method === 'POST' && url.pathname === '/api/otp/verify') return json(request, data => {
    const record = latestOtp.get(data.identifier);
    if (!record || record.expired) return send(response, 400, JSON.stringify({ success: false, message: 'OTP expired' }), 'application/json');
    if (data.otp !== record.otp) { record.attempts++; return send(response, 400, JSON.stringify({ success: false, message: 'Invalid OTP' }), 'application/json'); }
    if (data.mode === 'register') users.set(data.identifier, { identifier: data.identifier });
    sessions.add(data.identifier); send(response, 200, JSON.stringify({ success: true, message: 'Authentication successful' }), 'application/json');
  });
  send(response, 404, 'Not found', 'text/plain');
});

server.listen(port, '127.0.0.1', () => console.log(`Mock OTP server listening on http://127.0.0.1:${port}`));
