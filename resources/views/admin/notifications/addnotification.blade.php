@extends('admin.master');
@section('content');

<div class="content-wrapper">
    <h1 align="center"><label>Add Notifications</label></h1>
    
    <div class="container">
    <form acton=" " method="POST" enctype="multipart/form-data">
        @csrf
     
      
        <div class="mb-3">
          <label  class="form-label">Notifications</label>
          <input type="text" id="msg" name="msg" class="form-control" placeholder="Enter Notifications">
        </div>
         <button type="submit" class="btn btn-primary">Add</button>
      
    </form>
    </div>
</div>
    @endsection