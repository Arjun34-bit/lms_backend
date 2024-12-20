@extends('admin.master')

@section('content')
<div class="content-wrapper">
    <h1>Subjects</h1>
    <table class="table table-striped">
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            @foreach($subjects as $subject)
            <tr>
                <td>{{ $subject->id }}</td>
                <td>{{ $subject->name }}</td>
                <td>{{ $subject->description }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection 