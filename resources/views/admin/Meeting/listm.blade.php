@extends('admin.master');
@section('content');

<div class="content-wrapper">
    <a href="{{route('addm')}}">
        <button type="button" class="btn btn-primary d-inline-block m-2 float-right">Add Meeting</button>
</a>
<table class="table table-striped">
    <thead>
        <tr>
          <th scope="col">Id</th>
          <th scope="col">Meeting Name</th>
          <th scope="col">Link</th>
          <th scope="col">Operation</th>
         
        </tr>
      </thead>
      @foreach($meetings as $meeting)
      <tbody>
        <tr>
          <th scope="row">{{$meeting['_id']}}</th>
          <td>{{$meeting['m_name']}}</td>
          <td>{{$meeting['lname']}}</td> 
          </td>
          <td><a href="/editm/{{ $meeting->_id }}"  class="btn btn-sm btn-primary">Edit</a>
           <a href="/editm/{{ $meeting->_id }}"  class="btn btn-sm btn-danger">Delete</a>
         
        </tr>
    </tbody>
    @endforeach
  </table>
</div>
@endsection