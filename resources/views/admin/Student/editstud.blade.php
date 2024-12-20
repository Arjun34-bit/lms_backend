@extends('admin.master');
@section('content');

<div class="content-wrapper">
    <h1 align="center"><label>Edit Student</label></h1>
    
    <div class="container">
    <form action="/updatestud" method="POST"  enctype="multipart/form-data"> 
        @csrf
     
        <div class="mb-3">
            <input type="hidden" id="student_id" name="_id" value={{$student['_id']}} class="form-control" placeholder="Enter Title">
           </div>
        <div class="mb-3">
          <label  class="form-label">Student Name</label>
          <input type="text" id="name" name="stud_name" value={{$student['stud_name']}}  class="form-control" placeholder="Enter Student Name">
        </div>
        <div class="mb-3">
          <label  class="form-label">Class</label>
          <input type="text" id="name" name="class" value={{$student['class']}}  class="form-control" placeholder="Enter Class">
        </div>
        <div class="mb-3">
          <label  class="form-label">Student Iamge</label>
          <input type="file" id="stud_img" name="stud_img" value={{$student['stud_img']}}  class="form-control" placeholder="Enter Unit Name">
        </div>
        <div class="mb-3">
          <label  class="form-label">Mobile No</label>
          <input type="text" id="name" name="mno" value={{$student['mno']}}  class="form-control" placeholder="Enter Mobile No">
        </div>
        <div class="mb-3">
          <label  class="form-label">Email Id</label>
          <input type="text" id="email" name="email" value={{$student['email']}}  class="form-control" placeholder="Enter Email ID">
        </div>
        
       
        <button type="submit" class="btn btn-primary">Update</button>
      
    </form>
    </div>
  </div>
    @endsection