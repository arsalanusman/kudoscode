import React from 'react';
import Button from '../theme/components/Button'
import Checkbox from '../theme/components/Checkbox'
import Table from '../theme/components/Table'
import Card from '../theme/components/Card'
import Input from '../theme/components/Input'
import Switch from '../theme/components/Switch'
import Badge from '../theme/components/Badge'
import MessageBox from '../theme/components/MessageBox'
import Alerts from '../theme/components/Alerts'
import Grid from '../theme/components/Grid'
import Dropdown from '../theme/components/Dropdown'
import MaskImage from './../theme/assets/Mask.png'
import Mail from './../theme/assets/mail.png'
import Oval from './../theme/assets/Oval.png'
const Home = ({ state }) => {


    localStorage.setItem('currentUserId','0')


    let options = ['Useproof.com','Useproof.com 1','Useproof.com 2','Useproof.com 3','Useproof.com 4'];

    const table = [
        {date:'Today',description:'Update Header',status:'pending',price:50},
        {date:'Today',description:'Update Header',status:'process',price:50},
        {date:'Today',description:'Update Header',status:'complete',price:225}
    ]
    const table2 = [
        {description:'Update Header Website',status:true,price:50,time:"1"},
        {description:'Background Fix',status:true,price:50,time:"2"},
        {description:'SEO Modification',status:false,price:225,time:"4.5"},
    ]

    //let words = 'I woke up early today';
    //let SplitWords = words.split(' ');
    //let size = 0;
    //let max = [''];
    //SplitWords.map((items)=>{
    //   if(items.length > size){
    //     return console.log(items)
    //   }}
    //)
    return (
        <>
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
                                <div className="row">
                                    <Grid col="8"><h1><em>Sites</em></h1></Grid>
                                    <Grid col="2" align="right">
                                        <Dropdown data={options} />
                                        <Checkbox title="Checkbox"/>
                                    </Grid>
                                </div>
                                <div className="row">
                                    <Grid col="5">
                                        <Card>
                                            <h3>Sample CTA Box</h3>
                                            <form>
                                                <Input lable="Client Name / Company" icon="user-i" type="text" placeholder="Enter Client Name" />
                                                <Input lable="Email" icon="pass-i" type="email" placeholder="Enter Email Address" />
                                                <Switch title="Standard $50/hr"/>
                                                <Button type="primary" field="submit"  title="Add Website" icon="" color="" link="#"/>
                                            </form>
                                        </Card>
                                    </Grid>
                                    <Grid col="5">
                                        <MessageBox img={Oval} message="Hi Luke, everything on your fix list made sense. If you have any questions - feel free to give us a call at 1-800-355-8367" reply="#" call="#" />
                                        <Badge title="WordPress Website" url="#" slug="Useproof.com" img={MaskImage} />
                                        <Alerts icon={Mail} alert="success" message="A new fix list was received 35 min ago via email and is still being processed" />
                                    </Grid>
                                </div>
                                <div className="row">
                                    <Grid col="10">
                                        <Table style="recentfixes" data={table} />
                                        <Table data={table2} />
                                    </Grid>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default Home;
