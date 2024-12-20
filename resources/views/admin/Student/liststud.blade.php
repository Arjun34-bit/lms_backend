@extends('admin.master');
@section('content');


<div class="content-wrapper">
    <a href="{{route('addstudent')}}">
          <button type="button" class="btn btn-primary d-inline-block m-2 float-right">Add Student</button>
</a>


<table class="table table-striped">
    <thead>
        <tr>
          <th scope="col">Id</th>
          <th scope="col">Student Name</th>
          <th scope="col">Class</th>
          <th scope="col">Student Image</th>
          <th scope="col">Mobile No</th>
          <th scope="col">E-Mail ID</th>
          <th scope="col">Operation</th>
         
        </tr>
      </thead>
      @foreach($students as $student)
      <tbody>
        <tr>
          <th scope="row">{{$student['_id']}}</th>
          <td>{{$student['stud_name']}}</td>
          <td>{{$student['class']}}</td>
          <td> 
            <img src="{{ Storage::disk('minio')->url('uploads/student/' . $student->stud_img) }}" width="50" height="50" class="img img-responsive"/>
          </td>

          
          <td>{{$student['mno']}}</td>
          <td>{{$student['email']}}</td>
          <td>
           <a href="{{'editstud/'.$student['_id']}}"  class="btn btn-sm btn-primary">Edit</a>
          <a href="{{'deletestud/'.$student['_id']}}"  class="btn btn-sm btn-danger">Delete</a></td>
        </tr>
    </tbody>
    @endforeach
  </table>
</div>
@endsection