import React from 'react';
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'

const Content = ({ state }) => {
    return (
        <div className="container">
            <div className="row">
            <div id="primary" className="row-fluid">
                <div id="content" role="main" className="span8 offset2">
                <article className="post">
                    <div className="the-content">
                        <h1><em>Some</em> really cool H1 headline.</h1>
                        <p> Donec facilisis tortor ut augue lacinia, at viverra est semper.<br />Sed sapien metus, scelerisque nec pharetra id, tempor</p>
                        <h2><span>Some really cool H2 headline.</span></h2>
                        <h3><span>Some really cool H3 headline.</span></h3>
                        <h4><span>Some really cool H4 headline.</span></h4>

                        <Button type="primary" field="a" title="Call Me" icon="call" color="dark" link="#"/>
                        <Button type="primary" field="a" title="Call Me" icon="call" color="lightblue" link="#"/>
                            <Button type="secondary" field="a" title="Call Me" icon="" color="" link="#"/>

                        <Card>
                            <h3>Sample CTA Box</h3>
                            <form>
                                <Input lable="Client Name / Company" icon="user-i" type="text" placeholder="Enter Client Name" />
                                <Input lable="Email" icon="user-i" type="email" placeholder="Aasdf" />
                                <Button type="primary" field="submit" title="Call Me" icon="" color="" link="#"/>
                            </form>
                        </Card>

                    </div>
                </article>
                </div>
            </div>
            </div>
        </div>
    );
}

export default Content;
