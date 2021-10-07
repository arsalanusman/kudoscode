import React from 'react';
import styled from 'styled-components';
import Checkbox from '../components/Checkbox'

const Table = ({data,style}) => {
    function renderSwitch(param) {
        switch(param) {
            case 'cancel':
                return (<td className="cancel">Cancel</td>);
            case 'process':
                return (<td className="complete">Complete</td>);
            case 'complete':
                return (<td className="process">Working</td>);
            default:
                return (<td className="pending">Waiting Approval</td>);
        }
    }
    if(style == 'recentfixes'){
    return (
        <TableData>
            <thead>
                <tr>
                    <td>Date</td>
                    <td>Description</td>
                    <td>Status</td>
                    <td className="price">Price</td>
                </tr>
            </thead>
            <tbody>
            {data.map((items,index)=>
                <tr key={index}>
                    <td>{items.date}</td>
                    <td width="60%">{items.description}</td>
                    {renderSwitch(items.status)}
                    <td className="price">${items.price}</td>
                </tr>
            )}


            </tbody>
        </TableData>
    )}else{

        const Total = ({products,total}) => {
            let myTotal = 0;
            if(total == 'price'){
                for (var i = 0; i < products.length; i++) {
                    myTotal += parseInt(products[i]['price']);
                }
            }else{
                for (var i = 0; i < products.length; i++) {
                    myTotal += parseInt(products[i]['time']);
                }
            }
            return myTotal
        }

        return (
            <TableData>
                <thead>
                <tr>
                    <td width="90%">Description</td>
                    <td>Time</td>
                    <td className="price">Cost</td>
                </tr>
                </thead>
                <tbody>
                {data.map((items,index)=>
                    <tr key={index}>
                        <td><Checkbox id={index} title={items.description} status={items.status} /></td>
                        <td width="60%">{items.time} hr</td>
                        <td className="price">${items.price}</td>
                    </tr>
                )}
                </tbody>
                <tfoot>
                    <tr>
                        <td className="total">Total</td>
                        <td width="60%"><Total products={data} total="hours" /> hr</td>
                        <td className="price">$<Total products={data} total="price" /></td>
                    </tr>
                </tfoot>
            </TableData>
        )
    }
}

export default Table;


const TableData = styled.table`
    position:relative;
    & thead {
        tr{
            td{
                font-weight:bold;
                font-size:16px;
                padding-bottom:5px;
            }
        }
    }
    & tbody{
        tr {
            td{ color:#57627A; border-bottom:1px solid hsla(0, 0%, 59%, 0.31);padding:8px 0;}
        }
    }
    & tfoot{
        tr {
            td{ color:#57627A;padding:15px 0 0;}
        }
         & .price{font-size:18px;}
    }
    & .price{color:#18223D;font-weight:bold;text-align:right;}
    & .total{text-align:right;font-weight:bold;padding-right:20px;font-size:18px;color:#18223D;}
    & .pending{color:#E09800;font-weight:bold;}
    & .complete{color:#14C25D;font-weight:bold;}
    & .process{color:#012353;font-weight:bold;}
    & .cancel{color:red;font-weight:bold;}

`;
