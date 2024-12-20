@extends('layouts.admin')

@section('content')
<div class="container">
    <h1>Live Class Approvals</h1>
    <table class="table">
        <thead>
            <tr>
                <th>Title</th>
                <th>Instructor</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($pendingLiveClasses as $liveClass)
            <tr>
                <td>{{ $liveClass->title }}</td>
                <td>{{ $liveClass->instructor->name }}</td>
                <td>
                    <form action="{{ route('admin.live-classes.approve', $liveClass->id) }}" method="POST">
                        @csrf
                        @method('PATCH')
                        <button type="submit" class="btn btn-success">Approve</button>
                    </form>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection 