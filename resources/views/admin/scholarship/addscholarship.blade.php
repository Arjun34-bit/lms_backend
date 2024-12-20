@extends('admin.master');
@section('content');

<div class="content-wrapper">
    <h1 align="center"><label>Add Scholarship News</label></h1>
    
    <div class="container">
    <form acton=" " method="POST" enctype="multipart/form-data">
        @csrf
     
      
        <div class="mb-3">
          <label  class="form-label">Scholarship News</label>
          <input type="text" id="news" name="news" class="form-control" placeholder="Enter News">
        </div>
         <button type="submit" class="btn btn-primary">Add</button>
      
    </form>
    </div>
  </div>
    @endsection