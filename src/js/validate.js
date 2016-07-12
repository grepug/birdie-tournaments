export default function (pattern, value) {
  var vali = new Validate()
  return vali
}

class Validate {

  phone (arg, code) {
    switch (code) {
      case 86:
        return /^1[3|4|5|7|8][0-9]\d{8}$/.test(arg)
      default:
        return /^1[3|4|5|7|8][0-9]\d{8}$/.test(arg)
    }
  }

  email (arg) {
    return
  }

  veriCode (arg) {
    return /^\d{6}$/.test(arg)
  }

  password (arg) {
    return /^[a-zA-Z0-9_\-]{4,16}$/.test(arg)
  }

}
