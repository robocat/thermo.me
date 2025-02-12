function utf8_decode(e) {
    var t = [],
        n = 0,
        r = 0,
        i = 0,
        s = 0,
        o = 0;
    e += "";
    while (n < e.length) {
        i = e.charCodeAt(n);
        if (i < 128) {
            t[r++] = String.fromCharCode(i);
            n++;
        } else if (i > 191 && i < 224) {
            s = e.charCodeAt(n + 1);
            t[r++] = String.fromCharCode((i & 31) << 6 | s & 63);
            n += 2;
        } else {
            s = e.charCodeAt(n + 1);
            o = e.charCodeAt(n + 2);
            t[r++] = String.fromCharCode((i & 15) << 12 | (s & 63) << 6 | o & 63);
            n += 3;
        }
    }
    return t.join("");
}
function base64_decode(e) {
    var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var n, r, i, s, o, u, a, f, l = 0,
        c = 0,
        h = "",
        p = [];
    if (!e) {
        return e;
    }
    e += "";
    do {
        s = t.indexOf(e.charAt(l++));
        o = t.indexOf(e.charAt(l++));
        u = t.indexOf(e.charAt(l++));
        a = t.indexOf(e.charAt(l++));
        f = s << 18 | o << 12 | u << 6 | a;
        n = f >> 16 & 255;
        r = f >> 8 & 255;
        i = f & 255;
        if (u == 64) {
            p[c++] = String.fromCharCode(n);
        } else if (a == 64) {
            p[c++] = String.fromCharCode(n, r);
        } else {
            p[c++] = String.fromCharCode(n, r, i);
        }
    } while (l < e.length);
    h = p.join("");
    h = this.utf8_decode(h);
    return h;
}

function base64_encode (data) {
  // http://kevin.vanzonneveld.net
  // +   original by: Tyler Akins (http://rumkin.com)
  // +   improved by: Bayron Guevara
  // +   improved by: Thunder.m
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Pellentesque Malesuada
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Rafał Kukawski (http://kukawski.pl)
  // *     example 1: base64_encode('Kevin van Zonneveld');
  // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
  // mozilla has this native
  // - but breaks in 2.0.0.12!
  //if (typeof this.window['btoa'] == 'function') {
  //    return btoa(data);
  //}
  var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
    ac = 0,
    enc = "",
    tmp_arr = [];

  if (!data) {
    return data;
  }

  do { // pack three octets into four hexets
    o1 = data.charCodeAt(i++);
    o2 = data.charCodeAt(i++);
    o3 = data.charCodeAt(i++);

    bits = o1 << 16 | o2 << 8 | o3;

    h1 = bits >> 18 & 0x3f;
    h2 = bits >> 12 & 0x3f;
    h3 = bits >> 6 & 0x3f;
    h4 = bits & 0x3f;

    // use hexets to index into b64, and append result to encoded string
    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  } while (i < data.length);

  enc = tmp_arr.join('');

  var r = data.length % 3;

  return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);

}