package com.huna2.agenticxp

default allow := false

allow if {
	user
	user.email
}

default user := null

user := u if {
	input.headers.authorization
	raw_token := substring(input.headers.authorization, 7, -1)
	decoded_token := io.jwt.decode(raw_token)
	kid := decoded_token[0].kid
	jwks := http.send({
		"url": sprintf("%s/keys?kid=%s", [data.idp.issuerInternalUrl, kid]),
		"cache": true,
		"method": "GET",
		"force_cache": true,
		"force_cache_duration_seconds": 3600,
	}).raw_body
	signature_ok := io.jwt.verify_rs256(raw_token, jwks)
	signature_ok
	exp := decoded_token[1].exp
	now := time.now_ns() / 1000000000
	now < exp
	u := decoded_token[1]
}

default is_admin := false

is_admin if {
	some s in data.adminEmails
	s == user.email
}
