const Cookie = {
  getCookie: function(name) {
    const arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]);
    return null;
  },

  deleteCookie: function(name, domain, path) {
    var d = new Date();
    d.setDate(d.getDate() - 1);
    var domain = domain || document.domain;
    var path = path || "/";
    document.cookie = name + "=; expires=" + d + "; domain=" + domain + "; path=" + path;
  },

  deleteAllCookies: function(domain, path) {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++){
      if (cookies[i]) {
        this.deleteCookie(cookies[i].split("=")[0], path, domain);
      }
    }
  },

  clearAllCookie: function() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain="+document.domain;
    }
    return true;
  },

  setCookie: function(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  },
};

export default Cookie;
