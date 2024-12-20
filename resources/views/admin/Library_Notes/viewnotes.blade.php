@extends('admin.master');
@section('content');

<div class="content-wrapper">
    <h1 align="center"><label>View Notes</label></h1>
    
    <div class="container">
   {{$note->subject}}
   <iframe src="/assets/uploads/notes/{{$note->file}}"></iframe>

    </div>
</div>
    @endsection