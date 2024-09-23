export interface AccessToken {
	id: string;
	token: string;
	expires: Date;
}

export interface RefreshToken {
	id: string;
	token: string;
	expires: Date;
}

export interface TokenDefination {
	access: AccessToken;
	refresh: RefreshToken;
}