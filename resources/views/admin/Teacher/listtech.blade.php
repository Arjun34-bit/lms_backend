@extends('admin.master')
@section('content')

<div class="content-wrapper">
    <a href="{{route('addtech')}}">
        <button type="button" class="btn btn-primary d-inline-block m-2 float-right">Add Teacher</button>
    </a>
    <a href="{{route('addass')}}">
        <button type="button" class="btn btn-primary d-inline-block m-2 float-right">Add Assignment</button>
    </a>
    <table class="table table-striped">
        <thead>
            <tr>
                <th scope="col">Id</th>
                <th scope="col">Teacher Name</th>
                <th scope="col">Class</th>
                <th scope="col">Teacher Image</th>
                <th scope="col">Mobile No</th>
                <th scope="col">E-Mail ID</th>
                <th scope="col">Operation</th>
            </tr>
        </thead>
        @foreach($teachers as $teacher)
        <tbody>
            <tr>
                <th scope="row">{{$teacher['_id']}}</th>
                <td>{{$teacher['name']}}</td>
                <td>{{$teacher->subject ? $teacher->subject->name : 'N/A'}}</td>
                <td> 
                    <img src="{{asset('uploads/teacher/'.$teacher->tech_img)}}" width="50" height="50" class="img img-responsive"/>
                </td>
                <td>{{$teacher['mno']}}</td>
                <td>{{$teacher['email']}}</td>
                <td>
                    <a href="{{'edittech/'.$teacher['_id']}}" class="btn btn-sm btn-primary">Edit</a>
                    <a href="{{'deletetech/'.$teacher['_id']}}" class="btn btn-sm btn-danger">Delete</a>
                </td>
            </tr>
        </tbody>
        @endforeach
    </table>
</div>
@endsection