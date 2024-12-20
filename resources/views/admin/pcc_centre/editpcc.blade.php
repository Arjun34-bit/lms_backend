@extends('admin.master');
@section('content');

<div class="content-wrapper">
    <h1 align="center"><label>Edit Pcc Center </label></h1>
    
    <div class="container">
    <form action="/updatepcc" method="POST"  enctype="multipart/form-data"> 
        @csrf
     
        <div class="mb-3">
            <input type="hidden" id="_id" name="_id" value={{$pcccenter['_id']}} class="form-control" placeholder="Enter Title">
           </div>
        <div class="mb-3">
          <label  class="form-label">Pcc Center Name</label>
          <input type="text" id="pccname" name="pccname" value={{$pcccenter['pccname']}}  class="form-control" placeholder="Enter Pcc Name">
        </div>
        <div class="mb-3">
          <label  class="form-label">Email</label>
          <input type="text" id="email" name="email" value={{$pcccenter['email']}}  class="form-control" placeholder="Enter Email">
        </div>
        <div class="mb-3">
          <label  class="form-label">Pcc Iamge</label>
          <input type="file" id="pimg" name="pimg" value={{$pcccenter['pimg']}}  class="form-control">
        </div>
        <div class="mb-3">
          <label  class="form-label">Mobile No</label>
          <input type="text" id="name" name="mno" value={{$pcccenter['mno']}}  class="form-control" placeholder="Enter Mobile No">
        </div>
        <div class="mb-3">
          <label  class="form-label">Location</label>
          <input type="text" id="location" name="locatio" value={{$pcccenter['location']}}  class="form-control" placeholder="Enter Email ID">
        </div>
        
       
        <button type="submit" class="btn btn-primary">Update</button>
      
    </form>
    </div>
  </div>
    @endsection