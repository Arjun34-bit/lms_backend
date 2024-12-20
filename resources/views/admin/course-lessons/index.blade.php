@extends('admin.master')

@section('content')
    <div class="content-wrapper">
        <div class="content-header">
            <div class="container-fluid">
                <div class="row mb-2">
                    <div class="col-sm-6">
                        <h1 class="m-0">Lessons for {{ $course['title'] }}</h1>
                    </div>
                    <div class="col-sm-6">
                        <div class="float-sm-right">
                            <a href="{{ route('courses.lessons.create', $course['_id']) }}" class="btn btn-primary">
                                <i class="fas fa-plus"></i> 
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <section class="content">
            <div class="container-fluid">
                @if(session('success'))
                    <div class="alert alert-success">
                        {{ session('success') }}
                    </div>
                @endif

                @if(session('error'))
                    <div class="alert alert-danger">
                        {{ session('error') }}
                    </div>
                @endif

                <div class="card">
                    <div class="card-body p-0">
                        <table class="table table-responsive">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Duration</th>
                                    <th>Status</th>
                                    <th>Free</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($lessons as $lesson)
                                <tr>
                                    <td style="word-wrap: break-word;">{{ $lesson->title }}</td>
                                    <td>{{ $lesson->duration ?? 'N/A' }}</td>
                                    <td>
                                        <span class="badge badge-{{ $lesson->status === 'published' ? 'success' : 'warning' }}">
                                            {{ ucfirst($lesson->status) }}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="badge badge-{{ $lesson->is_free ? 'success' : 'secondary' }}">
                                            {{ $lesson->is_free ? 'Free' : 'Paid' }}
                                        </span>
                                    </td>
                                    <td>
                                        <div class="d-flex">
                                            <a href="{{ route('courses.lessons.edit', [$course['_id'], $lesson->id]) }}" 
                                               class="btn btn-sm btn-info mr-1">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                            <form action="{{ route('courses.lessons.destroy', [$course['_id'], $lesson->id]) }}" 
                                                  method="POST" 
                                                  class="d-inline">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" 
                                                        class="btn btn-sm btn-danger" 
                                                        onclick="return confirm('Are you sure you want to delete this lesson?')">
                                                    <i class="fas fa-trash"></i>
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