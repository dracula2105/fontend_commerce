import React, { useEffect } from 'react';
import {  Link} from "react-router-dom";
import {
  Button,
  Card,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col
} from "reactstrap";
import IndexNavbar from "components/Navbars/IndexNavbar";
import useForm from '../../Aform/useForm.js';
import {withRouter} from "react-router-dom"
import { submitLogin } from 'API/APIUtils';
import { ACCESS_TOKEN, GOOGLE_AUTH_URL,FACEBOOK_AUTH_URL } from 'API/URLMapping';
import { message } from 'antd';
function Login(props) {
  //get user
  
  document.documentElement.classList.remove("nav-open");
  useEffect(() => {
    document.body.classList.add("register-page");
    return function cleanup() {
      document.body.classList.remove("register-page");
    };

  });

  useEffect(()=>{
    if(props.authenticated){
      props.history.push("/");
    }
  },[props.authenticated])
  const { values, handleChange, handleSubmit } = useForm(login);
  function login() {   
    submitLogin(values)
    .then(response => {   
        localStorage.setItem(ACCESS_TOKEN, response.accessToken); 
        props.loginSuccess();
        props.history.push("/");
        
    }).catch(error => {
      message.error('Thông tin đăng nhập không đúng');
    });
  }


 
 
  return (
    <>
    
      <IndexNavbar />
      <div
        className="section section-image section-login"
        style={{
          backgroundImage: "url(" + require("assets/img/login-image.jpg") + ")"
        }}
      >
        <Container>
          <Row>
            <Col className="mx-auto" lg="4" md="6">
              <Card className="card-register">
                <h3 className="title mx-auto">Ecommerce</h3>
                <div className="social-line text-center">
                  <Button
                    className="btn-neutral btn-just-icon mr-1"
                    color="facebook"
                    href={FACEBOOK_AUTH_URL}
                    
                  >
                    <i className="fa fa-facebook-square" />
                  </Button>
                  <Button
                    className="btn-neutral btn-just-icon mr-1"
                    color="google"
                    href={GOOGLE_AUTH_URL}
                    
                  >
                    <i className="fa fa-google-plus" />
                  </Button>
                
                </div>
            
                <Form className="register-form" onSubmit={handleSubmit}>
                  <label>Email</label>
                  <InputGroup className="form-group-no-border">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText >
                        <i className="nc-icon nc-email-85" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Email" type="email" name="email" onChange={handleChange} value={values.email} required/>
                  </InputGroup>
                  <label>Password</label>
                  <InputGroup className="form-group-no-border">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="nc-icon nc-key-25" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Password" type="password" name="password" onChange={handleChange} value={values.password} required/>
                  </InputGroup>
                  <Button
                    block
                    className="btn-round"
                    color="danger"
                    type="submit" 
                  >
                    Login
                  </Button>
                </Form>
                <div className="forgot">
                 <Link to="/forget-password"> <Button
                    className="btn-link"
                    color="danger"
                              
                  >
                    Forgot password?
                  </Button>
                  </Link>
                </div>
              </Card>
              <div className="col text-center">
                <Button
                  className="btn-round"
                  outline
                  color="neutral"
                  href="/register"
                  size="lg"
                >
                  Đăng kí
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>{" "}
    </>
  );
}
export default withRouter(Login);