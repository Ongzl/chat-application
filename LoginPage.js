import { Button } from "@material-ui/core";
// import firebase from "firebase/app";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import "./style.css"
function PageLogin() {
    const handleGoogleSignIn = (firebase) => {
        var googleAuthProvider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(googleAuthProvider).then(function(result) {
            // This gives you a Google Access Token.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
        });
    };

    return (
        <>
            <div className="background-wrapper" id="main"/>
            <div className="select-profile-pic-wrapper" id="select-profile-pic-menu"/>
            <div className="get-started" id="login-screen">
                <p>
                    Chat <span className="login-p-subtitle">ella</span>
                </p>
                <input type="text" name="email" id="email" placeholder="Email" className="login-form"/>
                <input type="password" name="password" id="password" className="login-form" placeholder="Password"/>
                <input type="button" value="Login" className="login-btn" onClick="login()"/>
                <FirebaseAuthConsumer>
                    {({ firebase }) => (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleGoogleSignIn(firebase)}
                        >
                            Sign in with Google
                        </Button>
                    )}
                </FirebaseAuthConsumer>
            </div>

        </>
    );
}

export default PageLogin;