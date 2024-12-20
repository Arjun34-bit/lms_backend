@extends('admin.master');
@section('content');

<div class="content-wrapper">
    <h1 align="center"><label>Edit notification</label></h1>
    
    <div class="container">
    <form action="/updatenotification" method="POST" enctype="multipart/form-data">
        @csrf
     
        <div class="mb-3">
            <input type="hidden" id="_id" name="_id" value={{$notification['_id']}} class="form-control" placeholder="Enter Title">
          </div>
      
        <div class="mb-3">
          <label  class="form-label">Notification</label>
          <input type="text" id="msg" name="msg" value={{$notification['msg']}}  class="form-control" placeholder="Enter Notifications">
        </div>
       <button type="submit" class="btn btn-primary">Update</button>
      
    </form>
    </div>
  </div>
    @endsection