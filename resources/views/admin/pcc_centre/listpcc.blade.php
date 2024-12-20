@extends('admin.master');
@section('content');


<div class="content-wrapper">
    <a href="{{route('addpcc')}}">
          <button type="button" class="btn btn-primary d-inline-block m-2 float-right">Add Pcc Center</button>
</a>


<table class="table table-striped">
    <thead>
        <tr>
          <th scope="col">Id</th>
          <th scope="col">Pcc Image</th>
          <th scope="col">Pcc Name</th>
          <th scope="col">Email</th>
          <th scope="col">Mobile No</th>
          
          <th scope="col">Location</th>
          <th scope="col">Operation</th>
         
        </tr>
      </thead>
      @foreach($pcccenters as $pcccenter)
      <tbody>
        <tr>
          <th scope="row">{{$pcccenter['_id']}}</th>
          <td> 
            <img src="{{asset('uploads/pcc_centre/'.$pcccenter->pimg)}}" width="50" height="50" class="img img-responsive"/>
         </td>
          <td>{{$pcccenter['pccname']}}</td>
          <td>{{$pcccenter['email']}}</td>
          <td>{{$pcccenter['mno']}}</td>
          <td>{{$pcccenter['location']}}</td>
          
          
          <td>
           <a href="{{'editpcc/'.$pcccenter['_id']}}"  class="btn btn-sm btn-primary">Edit</a>
          <a href="{{'deletepcc/'.$pcccenter['_id']}}"  class="btn btn-sm btn-danger">Delete</a></td>
        </tr>
    </tbody>
    @endforeach
  </table>
</div>
@endsection