@extends('admin.master');
@section('content');

<div class="content-wrapper">
    <h1 align="center"><label>Add Student</label></h1>
    
    <div class="container">
    <form acton="" method="POST" enctype="multipart/form-data">
        @csrf
      
        <div class="mb-3">
          <label  class="form-label">Student Name</label>
          <input type="text" id="name" name="stud_name" class="form-control" placeholder="Enter Student Name">
          <label  class="form-label">Class</label>
          <input type="text" id="class" name="class" class="form-control" placeholder="Enter class Name">
          
          <label  class="form-label">Student Image</label>
          <input type="file" id="img" name="stud_img" class="form-control" placeholder=" ">
          <label  class="form-label">Mobile No</label>
          <input type="text" id="mno" name="mno" class="form-control" placeholder="Enter Mobile No">
          <label  class="form-label">E-Mail Id</label>
          <input type="text" id="email" name="email" class="form-control" placeholder="Enter E-Mail Id">
          
        </div>
       
        
       
        <button type="submit" class="btn btn-primary">Add</button>
      
    </form>
    </div>
    </div>
    @endsection