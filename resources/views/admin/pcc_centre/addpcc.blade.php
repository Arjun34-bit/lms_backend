@extends('admin.master');
@section('content');

<div class="content-wrapper">
    <h1 align="center"><label>Add Pcc Center</label></h1>
    
    <div class="container">
    <form acton="" method="POST" enctype="multipart/form-data">
        @csrf
      
        <div class="mb-3">
          <label  class="form-label">Pcc Name</label>
          <input type="text" id="pccname" name="pccname" class="form-control" placeholder="Enter Pcc Name">
          <label  class="form-label">Email</label>
          <input type="text" id="email" name="email" class="form-control" placeholder="Enter Email">
          
          <label  class="form-label">Pcc Image</label>
          <input type="file" id="pimg" name="pimg" class="form-control" placeholder=" ">
          <label  class="form-label">Mobile No</label>
          <input type="text" id="mno" name="mno" class="form-control" placeholder="Enter Mobile No">
          <label  class="form-label">Address</label>
          <input type="text" id="location" name="location" class="form-control" placeholder="Enter Address">
            
        </div>
       
        
       
        <button type="submit" class="btn btn-primary">Add</button>
      
    </form>
    </div>
    </div>
    @endsection