@extends('admin.master');
@section('content');

<div class="content-wrapper">
    <a href="{{route('addclassol')}}">
        <button type="button" class="btn btn-primary d-inline-block m-2 float-right">Add Class</button>
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
      @foreach($Livelectures as $Livelecture)
      <tbody>
        <tr>
          <th scope="row">{{$Livelecture['_id']}}</th>
          <td>{{$Livelecture['olclass']}}</td>
          <td>{{$Livelecture['link']}}</td>
          <td>
           <a href="/editclassol/{{ $Livelecture->_id }}"  class="btn btn-sm btn-primary">Edit</a>
          <a href="/deleteclassol/{{ $Livelecture->_id }}" class="btn btn-sm btn-danger">Delete</a></td>
        </tr>
    </tbody>
    @endforeach
    
  </table>

</div>
@endsection