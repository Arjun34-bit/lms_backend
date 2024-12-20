@extends('admin.master')

@section('content')
<div class="content-wrapper">
    <h1 align="center"><label>List of Bought Courses</label></h1>
   
    <div class="container">
        @forelse($data as $item)
            <div class="mb-3">
                <label class="form-label">Course ID</label>
                <input type="text" id="cid" name="cid" value="{{ $item->cid }}" class="form-control" placeholder="Course ID" readonly>
            </div>
            <div class="mb-3">
                <label class="form-label">Price</label>
                <input type="text" id="price" name="price" value="{{ $item->price }}" class="form-control" placeholder="User ID" readonly>
            </div>
            <div class="mb-3">
                <label class="form-label">Buy ID</label>
                <input type="text" id="_id" name="_id" value="{{ $item->_id }}" class="form-control" placeholder="User ID" readonly>
            </div>
        @empty
        <div class="mb-3">
            <p>No courses available</p>
          </div>
        @endforelse
    </div>
</div>
@endsection
