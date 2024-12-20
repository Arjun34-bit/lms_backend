@extends('admin.master');
@section('content');

<div class="content-wrapper">
    <a href="{{route('addscholarship')}}">
        <button type="button" class="btn btn-primary d-inline-block m-2 float-right">Add Scholarship</button>
</a>
<table class="table table-striped">
    <thead>
        <tr>
          <th scope="col">Id</th>
          <th scope="col">Scholarship News</th>
           <th scope="col">Operation</th>
         
        </tr>
      </thead>
      @foreach($scholarships as $scholarship)
      <tbody>
        <tr>
          <th scope="row">{{$scholarship['_id']}}</th>
          <td>{{$scholarship['news']}}</td>
     
          <td>
           <a href="/editscholarship/{{ $scholarship->_id }}"  class="btn btn-sm btn-primary">Edit</a>
          <a href="/deletescholarship/{{ $scholarship->_id }}" class="btn btn-sm btn-danger">Delete</a></td>
        </tr>
    </tbody>
    @endforeach
    
  </table>

</div>
@endsection