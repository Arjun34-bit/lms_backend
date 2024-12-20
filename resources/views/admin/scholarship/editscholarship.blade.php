@extends('admin.master');
@section('content');

<div class="content-wrapper">
    <h3 align="center"><label>Edit Scholarship News</label></h3>
    
    <div class="container">
    <form action="/updatescholarship" method="POST" enctype="multipart/form-data">
        @csrf
     
        <div class="mb-3">
            <input type="hidden" id="id" name="_id" value={{$scholarship['_id']}} class="form-control" placeholder="Enter Title">
           </div>
        <div class="mb-3">
          <label  class="form-label">scholarship NEws</label>
          <input type="text" id="news" name="news" value={{$scholarship['news']}}  class="form-control" placeholder="Enter Coursr Name">
        </div>
      
       <button type="submit" class="btn btn-primary">Update</button>
      
    </form>
    </div>
  </div>
    @endsection