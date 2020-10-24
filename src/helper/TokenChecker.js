import decode from 'jwt-decode';

export default function CheckToken() {
    const token = localStorage.getItem("token");
    if(token === null || token === "") {
        window.location.href="/login"
    } else {
        const decodedToken = decode(token);
        if (decodedToken.exp < Date.now() / 1000) {
                window.location.href="/login"
        } else {
            return true;
        }
    }
}