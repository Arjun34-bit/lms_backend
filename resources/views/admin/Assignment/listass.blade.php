@extends('admin.master');
@section('content');
<div>
  @if(session('message'))
   <div class="alert alert-danger col-sm-4" role="alert">
      {{session('message')}}
</div>

 

@endif
</div>
<div class="content-wrapper">
    <table class="table table-striped">
    <thead>
        <tr>
          <th scope="col">Id</th>
          <th scope="col">Assignment Name</th>
          <th scope="col">subject Name</th>
          <th scope="col">Questions</th>
           <th scope="col">Operation</th>
         
        </tr>
      </thead>
      @foreach($assignments as $assignment)
      <tbody>
        <tr>
          <th scope="row">{{$assignment['_id']}}</th>
          <td>{{$assignment['name']}}</td>
          <td>{{$assignment['sub_name']}}</td>
          <td>{{$assignment['que']}}</td>
          <td>
           <a href="/editass/{{ $assignment->_id }}"  class="btn btn-sm btn-primary">Edit</a>
          <a href="/deleteass/{{ $assignment->_id }}"  class="btn btn-sm btn-danger">Delete</a></td>
        </tr>
    </tbody>
    @endforeach
    
  </table>

</div>
@endsection