# Generated by Django 4.2 on 2023-08-02 12:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Thread',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(db_index=True, default='', max_length=255)),
                ('content', models.TextField(db_index=True)),
                ('creator_id', models.PositiveIntegerField(db_index=True)),
                ('creator_name', models.CharField(max_length=300)),
                ('creator_email', models.EmailField(max_length=254)),
                ('approver_id', models.PositiveIntegerField(db_index=True, default=0)),
                ('approved', models.BooleanField(default=False)),
                ('approver_name', models.CharField(default='', max_length=300)),
                ('approver_email', models.EmailField(default='', max_length=254)),
                ('created', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated', models.DateTimeField(auto_now=True, db_index=True)),
                ('parent', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='children', to='forum.thread')),
            ],
            options={
                'ordering': ['-created'],
            },
        ),
        migrations.CreateModel(
            name='ThreadVote',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.PositiveIntegerField(db_index=True)),
                ('user_name', models.CharField(max_length=300)),
                ('user_email', models.EmailField(max_length=254)),
                ('is_upvote', models.BooleanField(default=True)),
                ('created', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated', models.DateTimeField(auto_now=True, db_index=True)),
                ('thread', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='votes', to='forum.thread')),
            ],
            options={
                'ordering': ['-created'],
                'unique_together': {('thread', 'user_id')},
            },
        ),
        migrations.CreateModel(
            name='TaggedThread',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tag_id', models.PositiveIntegerField(db_index=True)),
                ('tag_name', models.CharField(max_length=100)),
                ('thread', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tags', to='forum.thread')),
            ],
            options={
                'unique_together': {('thread', 'tag_id')},
            },
        ),
    ]
