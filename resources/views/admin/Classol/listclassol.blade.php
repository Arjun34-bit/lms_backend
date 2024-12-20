@extends('admin.master');
@section('content');

<div class="content-wrapper">
    <a href="{{route('addclassol')}}">
        <button type="button" class="btn btn-primary d-inline-block m-2 float-right">Add Live Class</button>
</a>
<table class="table table-striped">
    <thead>
        <tr>
          <th scope="col">Id</th>
          <th scope="col">Live Class</th>
          <th scope="col">Link</th>
           <th scope="col">Operation</th>
         
        </tr>
      </thead>
      @foreach($classols as $classol)
      <tbody>
        <tr>
          <th scope="row">{{$classol['_id']}}</th>
          <td>{{$classol['olclass']}}</td>
          <td>{{$classol['link']}}</td>
          <td>
           <a href="/editclassol/{{ $classol->_id }}"  class="btn btn-sm btn-primary">Edit</a>
          <a href="/deleteclassol/{{ $classol->_id }}" class="btn btn-sm btn-danger">Delete</a></td>
        </tr>
    </tbody>
    @endforeach
    
  </table>

</div>
@endsection