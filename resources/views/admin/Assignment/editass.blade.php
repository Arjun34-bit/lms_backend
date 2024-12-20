@extends('admin.master');
@section('content');

<div class="content-wrapper">
    <h1 align="center"><label>Edit Assignment</label></h1>
    
    <div class="container">
    <form action="/updateass" method="POST" enctype="multipart/form-data">
        @csrf
     
        <div class="mb-3">
            <input type="hidden" id="_id" name="_id" value={{$assignment['_id']}} class="form-control" placeholder="Enter Title">
           </div>
        <div class="mb-3">
          <label  class="form-label">Name</label>
          <input type="text" id="name" name="name" value={{$assignment['name']}}  class="form-control" placeholder="Enter Coursr Name">
        </div>
        <div class="mb-3">
          <label  class="form-label">Subject Name</label>
          <input type="text" id="sub_name" name="sub_name" value={{$assignment['sub_name']}}  class="form-control" placeholder="Enter Subject Name">
        </div>
        <div class="mb-3">
          <label  class="form-label">Assignment Questions</label>
          {{-- <textarea name="" id="" cols="30" rows="10"></textarea> --}}
          <input type="text" id="que" name="que" value={{$assignment['que']}}  class="form-control" placeholder="Enter Course Name">
        </div>
       <button type="submit" class="btn btn-primary">Update</button>
      
    </form>
  </div>
    </div>
    @endsection