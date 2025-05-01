package com.huna2.agenticxp.authz

default allow = false
default is_admin = false
default user = null

allow if {
    user
    user.email
}

user = u if {
  input.headers.authorization
  rawToken := substring(input.headers.authorization, 7, -1)
  decodedToken := io.jwt.decode(rawToken)
  kid := decodedToken[0].kid
  jwks := http.send({
        "url": sprintf("%s/keys?kid=%s", [data.idp.issuerInternalUrl, kid]),
        "cache": true,
        "method": "GET",
        "force_cache": true,
        "force_cache_duration_seconds": 3600
    }).raw_body
  signatureOk := io.jwt.verify_rs256(rawToken, jwks)
  signatureOk
  exp := decodedToken[1].exp
  now := time.now_ns() / 1000000000
  now < exp
  u := decodedToken[1]
}

is_admin if {
  some s in data.adminEmails
  s == user.email
}