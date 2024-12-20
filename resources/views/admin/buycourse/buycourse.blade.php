@extends('admin.master');
@section('content');

<div class="content-wrapper">
    <h1 align="center"><label><h1 align="center">
      @if($userData)
          <label><p>Email: {{ $userData['email'] }}</p></label>
      @else
          <p>User data not available</p>
      @endif
  </h1>
  </label></h1>
  
    <form acton="" method="POST" enctype="multipart/form-data">
      @csrf
   
    <div class="container">
      @forelse($data as $item)
      
        <div class="mb-3">
          <label  class="form-label">Course Name</label>
          <input type="text" id="couname" name="couname"  value= "{{ $item->couname }}" class="form-control" placeholder="Enter Course Name">
        </div>
        
        <div class="mb-3">
            <label  class="form-label">Course Price</label>
            <input type="text" id="price" name="price" value= "{{ $item->price }}" class="form-control" placeholder="Enter Course Price">
          </div>
          @empty
         <button type="submit" class="btn btn-primary">Buy</button>
        </form>
    
    </div>
</div>
@endforelse
    @endsection