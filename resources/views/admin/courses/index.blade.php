@extends('admin.master')

@section('content')
    <div class="content-wrapper">
        <!-- Content Header (Page header) -->
        <div class="content-header">
            <div class="container-fluid">
                <div class="row mb-2">
                    <div class="col-sm-6">
                        <h1 class="m-0"><i class="fas fa-book"></i> Courses</h1>
                    </div>
                    <div class="col-sm-6">
                        <div class="float-sm-right">
                            <a href="{{ route('courses.create') }}" class="btn btn-primary">
                                <i class="fas fa-plus"></i> Create New Course
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <section class="content">
            <div class="container-fluid">
                @if (session('success'))
                    <div class="alert alert-success">
                        <i class="fas fa-check-circle"></i> {{ session('success') }}
                    </div>
                @endif

                <div class="card">
                    <div class="card-body p-0">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Level</th>
                                    <th>Type</th>
                                    <th>Price</th>
                                    <th>Created By</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($courses as $course)
                                    <tr>
                                        <td>{{ $course->title }}</td>
                                        <td><span class="badge bg-primary">{{ $course->category }}</span></td>
                                        <td><span class="badge bg-secondary">{{ $course->level }}</span></td>
                                        <td><span class="badge bg-success">{{ $course->type ?? 'N/A' }}</span></td>
                                        <td>${{ number_format($course->price, 2) }}</td>
                                        <td>
                                            @if(isset($course->instructor) && $course->instructor->role === 'admin')
                                                <span class="badge bg-info">Created by Admin</span>
                                            @else
                                                <span class="badge bg-info">Created by {{ $course->instructor->name ?? 'Unknown' }} (Instructor)</span>
                                            @endif
                                        </td>
                                        <td>
                                            <div class="d-flex">
                                                <a href="{{ route('courses.show', $course->_id) }}" 
                                                   class="btn btn-sm btn-info mr-1">
                                                    <i class="fas fa-eye"></i> View
                                                </a>
                                                <a href="{{ route('courses.edit', $course->_id) }}" 
                                                   class="btn btn-sm btn-warning mr-1">
                                                    <i class="fas fa-edit"></i> Edit
                                                </a>
                                                <form action="{{ route('courses.destroy', $course->_id) }}" 
                                                      method="POST" 
                                                      class="d-inline">
                                                    @csrf
                                                    @method('DELETE')
                                                    <button type="submit" 
                                                            class="btn btn-sm btn-danger" 
                                                            onclick="return confirm('Are you sure you want to delete this course?')">
                                                        <i class="fas fa-trash"></i> Delete
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    </div>
@endsection
