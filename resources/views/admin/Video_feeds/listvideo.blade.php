@extends('admin.master');
@section('content');

<div class="content-wrapper">
 
    <a href="{{route('video.add')}}">
        <button type="button" class="btn btn-primary d-inline-block m-2 float-right">Add Video</button>
</a>
<table class="table table-striped">
    <thead>
        <tr>
          <th scope="col">Id</th>
          <th scope="col">Line</th>
          <th scope="col">Video Name</th>
          <th scope="col"> Video</th>
           <th scope="col">Operation</th>
         
        </tr>
      </thead>
      @foreach($videos as $video)
      <tbody>
        <tr>
          <th scope="row">{{$video['_id']}}</th>
          <td>{{$video['line']}}</td>
          <td>{{$video['videoname']}}</td>
          
          <td>{{$video['videofile']}}</td>
          <td>
           <a href="/editvideo/{{ $video->_id }}"  class="btn btn-sm btn-primary">Edit</a>
          <a href="/deletevideo/{{ $video->_id }}" class="btn btn-sm btn-danger">Delete</a></td>
        </tr>
    </tbody>
    @endforeach
    
  </table>

</div>
@endsection