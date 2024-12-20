@extends('admin.master');
@section('content');

<div class="content-wrapper">
  
  <a href="{{route('addnotes')}}">
    <button type="button" class="btn btn-primary d-inline-block m-2 float-right">Add No</button>
</a>
    <table class="table table-striped">
    <thead>
        <tr>
          <th scope="col">Id</th>
         
          <th scope="col">subject Name</th>
          <th scope="col">View</th>
          <th scope="col">Download</th>
           <th scope="col">Operation</th>
         
        </tr>
      </thead>
      @foreach($notes as $note)
      <tbody>
        <tr>
          <th scope="row">{{$note['_id']}}</th>
          <td>{{$note['subject']}}</td>
          <td><a href="{{url('/view',$note->_id)}}">View</a></td>
          <td><a href="{{url('/download',$note->file)}}">Download</a></td>
          {{-- <td>{{$note['notes']}}</td> --}}
          {{-- <td> {{ asset('uploads/notes/' . $notes) }} --}}
         {{-- <td> <a href="{{ asset('uploads/notes/' . $notes) }}">View PDF</a>--}}
          </td>
        
          <td>
           <a href="/editnotes/{{ $note->_id }}"  class="btn btn-sm btn-primary">Edit</a>
          <a href="/deletenotes/{{ $note->_id }}"  class="btn btn-sm btn-danger">Delete</a></td>
        </tr>
    </tbody>
    @endforeach
    
  </table>

</div>
@endsection