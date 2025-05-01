package com.huna2.agenticxp

default allow = false

# Public authorization rule
allow if {
    user_is_logged_in
}

user_is_logged_in if {
  user_from_token
  user_from_token.email
}

user_from_token = u if {
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