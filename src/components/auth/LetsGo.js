import React, { Component } from 'react';
import Amplify, { Auth, API, Storage } from 'aws-amplify';
import awsmobile from './../../aws-exports';
import axios from 'axios';
Amplify.Logger.LOG_LEVEL = 'DEBUG';
Amplify.configure(awsmobile);

class Letsgo extends Component {

  constructor(props){
    super(props)
    this.state = {
      message:'',
      selectedFile:'',
      fileUrl:'',
      file:'',
      type:'',
      filename:''
    }
  }
  handleChange = (event) => {
    event.preventDefault();
    const file = event.target.files[0]
    console.log(file)
    this.getBase64(file, (result) => {
      this.setState({
            fileUrl:URL.createObjectURL(file),
            file,
            filename:file.name,
            type:file.type,
            base64:result
          })
    });
    //'https://amplify-devkodoscode-devkodos-180005-deployment.s3.us-east-1.amazonaws.com/'+file.name+'?response-content-disposition=attachment&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIAxtLJKtmb2MpbZMZlcIATk0PijZR%2BSerXIwRyBor2SEAiEA%2BIpF7yBN2MsSfeaT4ARV6nNrKpo4INsfspGbHrOrCV0qmAII6v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw4NTgwOTc5Njk2NDAiDFePx73gaxi4Jo58MyrsAfptfNARRoyLq7IW7%2Fssc9Jm96JL97e9gKrsWVzPpByASWGkzCpShahZ4MXaqNsFtBZfqbqhwXFhVO0twpa%2BmZLKfvc0SbNdh0zSj%2Bs3AlSY5aasa6PFlHiTvJGvKpneZnumD5lx0f37krn%2BxPfO4OVxJlg14sVFkYTqadZ2T5jBwvxfgugGsLomUj2G2S1ViXnrCbJbYk2i18Qn4%2FloRX53V3nLaFR3IRy6rjQU7eL%2FrUAJ8UBKDm0c71Pbbwd3ZU5dEmOAqHUuDjmp1IqPH3nQ2DwCRLm3Cgx744kL%2Fzr3%2B46zY7IQgxUP%2B0siMLONw%2FYFOvYCaKQ0XFHq%2FF7jiBSmxnqg1erECb%2BogKY3LgI4HYBMfKnFwNuT7BvvGCjq3Vk%2F%2FTbkYHUXLpd5laCSjGl8wln8GGreEnNv7Joxkoi7eiAHub0KD5zSiocuN43sULMTP9h5kdFOo10pFZu%2FLdeGfCBIDJFexCCoV6bA3IaGswH06fp6wM7Yhs04TMBok%2FqvJ%2BOEPqfa7mNTBooQpz7l%2BL%2Bo7CJhq4ICR4J4YJvF0voiJ6BjMuLDDiuNNMfemJlf5PSFqgoDtPTfm%2BmNvMs64Wsx5ZIUuP0KwLgxcnfRyozOTiAGShKqCCJSf3lijmhXvLFDsS8ukcOi1VRc6Oyh4LtoT1KTbqo9Q9TktiVSqLLxoLWv9NFLGD3DkQ9%2BNvS4MouvHoN1xRkYI%2FpuVmyRhUOcoWKD%2BSFqHNrMC5TgsdSOKvmgsO8WbzGb%2BPadqiyTomrNDQOABo8%2BB8WUZbm%2FIVEEwGLcUzKpwq885e%2B9MmsZQxbE%2BUbJ5iw%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200529T085252Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIA4PSU75HUHWSXM6MD%2F20200529%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=d5058b803fe3d87d1b25d25c83724d587fabca80a0f9434df73f6b74957e52d4'
  
  }
  onClickHandler = (event) => {
    event.preventDefault();
      const data = new FormData() 
      data.append('file', this.state.file)
      console.log(this.state.file,'sdfk')
      const remakeData = {
        lastModified: "1589874270174",
        lastModifiedDate: "Tue May 19 2020 12:44:30 GMT+0500 (Pakistan Standard Time) {}",
        name: this.state.filename,
        size: 12723,
        type:  this.state.type,
        webkitRelativePath: "",
        data:this.state.base64,
      }
      let apiName = 'devKudos';
      let path = '/upload';
      let init = {
        body: remakeData 
      }
	// let initss = {
 //       	 demo_file: this.state.file 
 //      }
 // https://t2j91cjick.execute-api.us-east-1.amazonaws.com/devkodos/upload
      axios.post("http://localhost:3001/upload", remakeData, { 
        // receive two    parameter endpoint url ,form data
      }) .then(res => { // then print response status
        console.log(res.statusText)
      })
       return API.post(apiName, path, init)
      // fetch('http://localhost:3001/upload',{
      //   method: 'POST', // *GET, POST, PUT, DELETE, etc.
      //   mode: 'cors', // no-cors, *cors, same-origin
      //   header:{
      //     "Access-Control-Allow-Origin": "*",
      //     "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
      //   },
      //   cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      //    body: JSON.stringify(initss)  // body data type must match "Content-Type" header
      // })

	// console.log(apiName, path, init, data, initss , 'kdds')
    //   return API.post(apiName, path, data)
    // .then(result => console.log(result))
    // .catch(err => console.log(err));

   // Storage.put(this.state.filename,this.state.file)
    //.then(()=>{
      //console.log('succesfully upload file')
      //this.setState({
      //  fileUrl:'',
      //  file:'',
      //  filename:''
     // })
    //}).catch((err)=>{
    //  console.log(err)
    //})
  }

  getBase64(file, cb) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
          cb(reader.result)
      };
      reader.onerror = function (error) {
          console.log('Error: ', error);
      };
  }
  sendViaEmail = () => {
    this.setState({
      message:'Thank you for select via email'
    })
  }
  render(){
    return (
      <section className="section auth">
          <h1>Lets Go</h1>
          <div className="sendViaEmail" onClick={()=>this.sendViaEmail()}>
            Send Via Email
            <div className="success">{this.state.message ? this.state.message:""}</div>
          </div>
          <div className="uploadFile">
            <form type="multipart/form-data" onSubmit={(event)=>this.onClickHandler(event)}>
              <input type='file' name='upload' onChange={(x)=>this.handleChange(x)}/>
              <img src={this.state.fileUrl} />
              <button type="submit">Upload</button> 
            </form>
          </div>
      </section>
    )
  }
}

export default Letsgo;
