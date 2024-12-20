@extends('admin.master')
@section('content')

<div class="content-wrapper">
    <h1 class="text-center">Advertisements</h1>
    <a href="{{ route('admin.advertisements.create') }}" class="btn btn-primary">Add Advertisement</a>
    <table class="table table-striped">
        <thead>
            <tr>
                <th>Title</th>
                <th>Media Type</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($advertisements as $advertisement)
            <tr>
                <td>{{ $advertisement->title }}</td>
                <td>{{ $advertisement->media_type }}</td>
                <td>{{ $advertisement->status }}</td>
                <td>
                    <a href="{{ route('admin.advertisements.edit', $advertisement->id) }}" class="btn btn-sm btn-primary">Edit</a>
                    <form action="{{ route('admin.advertisements.destroy', $advertisement->id) }}" method="POST" style="display:inline;">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-sm btn-danger">Delete</button>
                    </form>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>

@endsection 