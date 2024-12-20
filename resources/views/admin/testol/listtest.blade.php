@extends('admin.master');
@section('content');

<div class="content-wrapper">
  <a href="{{route('addtest')}}">
    <button type="button" class="btn btn-primary d-inline-block m-2 float-right">Add Test</button>
</a>
    
<table class="table table-striped">
    <thead>
        <tr>
          <th scope="col">Id</th>
          <th scope="col">Subject Name</th>
          <th scope="col">Test No</th>
          <th scope="col">Question</th>
           <th scope="col">Operation</th>
         
        </tr>
      </thead>
      @foreach($tests as $test)
      <tbody>
        <tr>
          <th scope="row">{{$test['_id']}}</th>
          <td>{{$test['subject']}}</td>
          <td>{{$test['no']}}</td>
          <td>{{$test['que']}}</td>
     
          <td>
           <a href="/edittest/{{ $test->_id }}"  class="btn btn-sm btn-primary">Edit</a>
          <a href="/deletetest/{{ $test->_id }}" class="btn btn-sm btn-danger">Delete</a></td>
        </tr>
    </tbody>
    @endforeach
    
  </table>

</div>
@endsection