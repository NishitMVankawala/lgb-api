import * as crypto from "crypto"

export const generateToken = () => {
	return new Promise<string>((resolve, reject) => {
		crypto.randomBytes(20, (err, buf) => {
			if (err) { reject(err) } else {
				resolve(buf.toString('hex'))
			}
		})
	})
}