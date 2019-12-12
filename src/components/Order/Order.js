
import React, { useEffect } from "react";


import { makeStyles } from '@material-ui/core/styles';

import DemoFooter from "components/Footers/DemoFooter";

import NarbarGlobal from "components/Navbars/NarbarGlobal";
import {
    Container,
    Row,
    Col,
    Label, Input, Form
} from "reactstrap";

import { Progress, message } from 'antd';
import useForm from "Aform/useForm";
import Axios from "axios";
import { ACCESS_TOKEN } from "API/URLMapping";
import { API_BASE_URL } from "API/URLMapping";
import QRCode from 'qrcode.react';
import { Modal, Button } from 'antd';

function Order(props) {
    const [activeTab, setActiveTab] = React.useState("1");

    const [data, setData] = React.useState([]);

    const [user, setUser] = React.useState([]);
    const [checked, setChecked] = React.useState(false);
    const [lstCart, setLstCart] = React.useState([]);
    const [totalPrice, setTotalPrice] = React.useState(0);
    const [checkOrder,setCheckOrder]=React.useState(false);
    const toggle = tab => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };
    React.useEffect(() => {
        setUser(props.currentUser);


    }, [props.currentUser]);
    React.useEffect(() => {
        props.history.push("/order");

    }, [user]);

    document.documentElement.classList.remove("nav-open");
    React.useEffect(() => {
        document.body.classList.add("landing-page");
        return function cleanup() {
            document.body.classList.remove("landing-page");
        };
    });
    function editProfile() {
        setChecked(true);
    }
    const { values, handleChange, handleSubmit } = useForm(updateUser); // initialise the hook
    async function updateUser() {
        user.address = values.address;
        user.phone = values.phone;
        if (localStorage.getItem(ACCESS_TOKEN)) {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN)
            }
            const response = await Axios.post(API_BASE_URL + "/user/updateUser", user, {
                headers: headers
            });
            setUser(response.data)
        }

    }
    useEffect(() => {

        if (localStorage.getItem(ACCESS_TOKEN) !== null) {
            setLstCart(JSON.parse(localStorage.getItem('mycart')));
        }
        else {
            props.history.push("/login");
        }

    }, [localStorage.getItem('mycart')]);


    React.useEffect(() => {

        if (lstCart) {
            let i = 0;
            lstCart.map(item => (
                i = i + item.product_details.pricesale
            ))
            setTotalPrice(i);
        }

    }, [lstCart]);
    
    useEffect( ()=>{
        try{
           if(data.length>0){
                        async function saveOrder(){
                            if (localStorage.getItem(ACCESS_TOKEN)) {
                                const headers = {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer '+localStorage.getItem(ACCESS_TOKEN)
                                }
                                const response=await  Axios.post(API_BASE_URL+"/order/addOrder", data, {
                                    headers: headers
                                });
                                console.log(response.data);
                                
                            }
                            else{
                                message.error("Không có sản phẩm nào được chọn!")
                            }
                    }
                    saveOrder();
           }
        }catch(err){
            setTotalPrice(0);
        }
          
    },[data])
     function finalOrder() {
        setData(lstCart);
        message.info("Bạn đã đặt hàng thành công!!!")
        localStorage.removeItem('mycart');
        setCheckOrder(true);
        showModal();
        
    }
    useEffect(()=>{
        setTotalPrice(0);
    },[checkOrder])


    const [visible, setvisible] = React.useState(false);
  

    function handleCancel() {
        setvisible(false);
    }
    function handleOk() {
        setvisible(false);
    }
    function showModal() {
        setvisible(true);
    }
    return (
        <>
     
        <Modal
          title="Thông tin đơn hàng"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <QRCode
            id='qrcode'
            value='http://localhost:3000/profile-page'
            size={290}
            level={'H'}
            includeMargin={true}
          />
        </Modal>


            <NarbarGlobal authenticated={props.authenticated} onLogout={props.onLogout} />\
            <Row>
                <Progress percent={100} size="small" status="active" />
            </Row>
            <div className="section section-navbars pt-100" style={{
                backgroundColor: '#f4f4f4'

            }}>
                <Container >

                    <div className="title">
                        <h3>Order</h3>
                    </div>
                    <Row >
                        <Col md="8" className="border">
                            <Row>
                                <label className="font-weight-bold p-2">{user && user.name}</label>
                            </Row>
                            <Row>
                                <label className=" p-1">Địa chỉ: {user && user.address}</label>
                            </Row>
                            <Row>
                                <label className=" p-1"> Điện thoại: {user && user.phone}</label>
                            </Row>


                        </Col>
                    </Row>
                    <Row className="font-weight-bold">Danh sách sản phẩm</Row>
                    {lstCart&&lstCart.map(item => (
                        <Row className="border-bottom">
                            <Col md="4">
                                <label className=" p-1">Sản phẩm: {item && item.name}</label>
                            </Col>

                            <Col md="4">
                                <label className=" p-1">Giá tiền: {item && item.product_details.pricesale}</label>
                            </Col>
                        </Row>
                    )
                    )}
                    <Row className="font-weight-bold">
                        <Col md="4">

                        </Col>
                        <Col md="4">
                            <label className=" p-1"> Tổng tiền:{totalPrice}đ</label>
                        </Col>


                    </Row>
                    <Row className="font-weight-bold">
                        <Col md="4">

                        </Col>
                        {totalPrice>0&&( <Col md="4">
                            <Button className="btn btn-primary" onClick={finalOrder} >Đặt hàng</Button>
                        </Col>)}
                       

                    </Row>

                </Container>
            </div>

            <DemoFooter />
        </>
    );
}



const useStyles = makeStyles(theme => ({

}));
export default Order;
