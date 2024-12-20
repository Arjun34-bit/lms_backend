@extends('admin.master');
@section('content');

<div class="content-wrapper">
    <h1 align="center"><label>Edit Teacher</label></h1>
    
    <div class="container">
    <form action="/updatetech" method="POST"  enctype="multipart/form-data"> 
        @csrf
     
        <div class="mb-3">
            <input type="hidden" id="_id" name="_id" value={{$teacher['_id']}} class="form-control" placeholder="Enter Title">
           </div>
        <div class="mb-3">
          <label  class="form-label">Teacher Name</label>
          <input type="text" id="tech_name" name="tech_name" value={{$teacher['tech_name']}}  class="form-control" placeholder="Enter Student Name">
        </div>
        <div class="mb-3">
          <label  class="form-label">Class</label>
          <input type="text" id="subject" name="subject" value={{$teacher['subject']}}  class="form-control" placeholder="Enter Class">
        </div>
        <div class="mb-3">
          <label  class="form-label">Student Iamge</label>
          <input type="file" id="tech_img" name="tech_img" value={{$teacher['tech_img']}}  class="form-control" placeholder="Enter Unit Name">
        </div>
        <div class="mb-3">
          <label  class="form-label">Mobile No</label>
          <input type="text" id="name" name="mno" value={{$teacher['mno']}}  class="form-control" placeholder="Enter Mobile No">
        </div>
        <div class="mb-3">
          <label  class="form-label">Email Id</label>
          <input type="text" id="email" name="email" value={{$teacher['email']}}  class="form-control" placeholder="Enter Email ID">
        </div>
        
       
        <button type="submit" class="btn btn-primary">Update</button>
      
    </form>
    </div>
  </div>
    @endsection