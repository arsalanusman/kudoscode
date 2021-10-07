import React from 'react';
import styled from 'styled-components';

const Alerts = ({ message, icon, alert }) => {
    return (
        <Alert className={"alert "+"alert-"+ alert + [icon ? ' isIcon': ""]}>
            <img src={icon} />
            <p>{message}</p>
        </Alert>
    );
}

export default Alerts;

const Alert = styled.div`
  box-shadow: 0px 1px 14px rgba(24, 35, 61, 0.059);
  padding: 15px 18px;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: #fff;

    &.alert-success{
        background: rgba(1,121,184,0.07);
    }
    &.isIcon img {
      float: left;
      padding-right: 13px;
    }

    &.isIcon p {
      float: left;
      width: calc(100% - 52px);
      line-height: 16px;
      margin-bottom: 0px;
    }

    &:after, &:before {
      content: '';
      display: block;
      clear: both;
    }
`;

