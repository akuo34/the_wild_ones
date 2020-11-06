import Head from 'next/head'

export default function Login() {
  return (
    <div>
      <Head>
        <title>Admin Login | The Wild Ones</title>
        <link rel="icon" href="/white_logo.jpg" />
      </Head>
      <div className="buffer"></div>
      <div className="container-landing">
        <h2 className="subheader-client">admin console</h2>
        <div className="form-gallery">
          <h4 className="text-gallery-form-header">Sign in</h4>
          {/* <form id="form-login" onSubmit={props.signInHandler}> */}
          <form id="form-login">
            <input
              className="input-landing"
              // type="email" 
              name="userEmail"
              placeholder="E.g: johnDorian123@gmail.com"
              id="userEmail"
            />
            <input
              className="input-landing"
              type="password"
              name="userPassword"
              placeholder="Your password"
              id="userPassword"
            />
            <div className="container-landing-button">
              {/* <Link className="link-landing" to="/admin/passwordReset">Forgot your password?</Link> */}
              <button className="button-gallery-post" type="submit">Sign In</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}