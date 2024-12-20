@extends('admin.master');
@section('content');

<div class="content-wrapper">
  {{-- <a href="">
    <button type="button" class="btn btn-warning d-inline-block m-2 float-right">  <i class="nav-icon fas fa-copy"></i>  WishList</button>
</a>
<a href="">
<button type="button" class="btn btn-danger d-inline-block m-2 float-right">Buy Cart</button>
</a>  --}}
    <a href="{{route('addcourse')}}">
        <button type="button" class="btn btn-primary d-inline-block m-2 float-right">Add Course</button>
</a>
<div>
  @if(session('message'))
   <div class="alert alert-primary col-sm-4" role="alert">
      {{session('message')}}
</div>

@endif
</div>
<table class="table table-striped">
    <thead>
        <tr>
          <th scope="col">Id</th>
          <th scope="col">Course Name</th>
          <th scope="col">Course Image</th>
          <th scope="col">Course Price</th>
          <th scope="col">Course Category</th>
          <th scope="col">Buy/Wishlist</th>
          <th scope="col">Operation</th>
        </tr>
      </thead>
      @php
      $courseCategories = [
          'live' => 'Live',
          'featured' => 'Featured',
          'top' => 'Top'
      ];
      @endphp
      @foreach($courses as $course)
      <tbody>
        <tr>
          <th scope="row">{{$course['id']}}</th>
          <td>{{$course['couname']}}</td>
          
          <td> 
            <img src="{{ Storage::disk('minio')->url('uploads/course/' . $course->cimg) }}" width="50" height="50" class="img img-responsive"/>
         </td>
         <td>{{$course['price']}}</td>
          <td>{{ $courseCategories[$course->course_category] ?? 'Unknown' }}</td>
 
       <td><a href={{route('buycourse')}} class="btn btn-sm btn-primary">Buy</a>
        <a href="/wishlistcourse/{{ $course->id }}"  class="btn btn-sm btn-primary">wishlist</a>

       </td>
          <td>
           <a href="/editcourse/{{ $course->_id }}"  class="btn btn-sm btn-primary">Edit</a>
          <a href="/deletecourse/{{ $course->_id }}" class="btn btn-sm btn-danger">Delete</a></td>
        </tr>
    </tbody>
    @endforeach
    
  </table>

</div>
@endsection