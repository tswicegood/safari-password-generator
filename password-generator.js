
/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1 Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

var b64pad  = "";
var chrsz   = 8;

function b64_sha1(s){return binb2b64(core_sha1(str2binb(s),s.length * chrsz));}

function core_sha1(x, len) {
  x[len >> 5] |= 0x80 << (24 - len % 32);
  x[((len + 64 >> 9) << 4) + 15] = len;

  var w = Array(80);
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  var e = -1009589776;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    var olde = e;

    for(var j = 0; j < 80; j++)
    {
      if(j < 16) w[j] = x[i + j];
      else w[j] = rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
      var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
                       safe_add(safe_add(e, w[j]), sha1_kt(j)));
      e = d;
      d = c;
      c = rol(b, 30);
      b = a;
      a = t;
    }

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }
  return Array(a, b, c, d, e);

}

function sha1_ft(t, b, c, d)
{
  if(t < 20) return (b & c) | ((~b) & d);
  if(t < 40) return b ^ c ^ d;
  if(t < 60) return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}

function sha1_kt(t)
{
  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
         (t < 60) ? -1894007588 : -899497514;
}

function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

function str2binb(str)
{
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
  return bin;
}

function binb2b64(binarray)
{
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i += 3)
  {
    var triplet = (((binarray[i   >> 2] >> 8 * (3 -  i   %4)) & 0xFF) << 16)
                | (((binarray[i+1 >> 2] >> 8 * (3 - (i+1)%4)) & 0xFF) << 8 )
                |  ((binarray[i+2 >> 2] >> 8 * (3 - (i+2)%4)) & 0xFF);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
      else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
    }
  }
  return str;
}

function getDomain(url) {
    var commonDomains = 'info|co.uk|com|net|org|tv|gov|biz|us|cc|mobi|jp|ca|dk|co.il';
    var domain = url.match(/^(?:http|https|ftp|chrome):\/\/(?:[\/]*?@)?(.[^/]+)/);
    if(!domain)return url;
    
    fullDomain=domain[1];
    //parse out subdomain, some of the time
    var reg = new RegExp("([^.]+.(?:"+commonDomains+"))$");
    var rootDomain = fullDomain.match(reg);
    if(!rootDomain)return fullDomain;
    return rootDomain[1];
}

function generatePassword(domain, master) {
    var trailingStr = "1a!";
    password.value = b64_sha1(domain + ':' + master).substr(0,8) + trailingStr;
}

// END CODE BORROWED FROM Password Generator

function performCommand(event) {
    console.debug('performCommand called');
    if (event.command !== "showGenerateRandomPassword") {
        console.debug('not the correct command');
        return;
    }

    var currentURL = event.target.browserWindow.activeTab.url;
    console.debug(currentURL);

    var modalCss = document.getElementById("passwordDialogCSS").textContent;

    console.log(event);
    console.debug(modalCss);
    event.target.browserWindow.activeTab.page.dispatchMessage("displayPasswordGenerator", {
        modalCss: modalCss
    });
}

console.log("hello there");
console.log(safari);
safari.application.addEventListener("command", performCommand, false);

