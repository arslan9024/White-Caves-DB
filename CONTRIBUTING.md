# Contributing to White Caves Real Estate Database

Thank you for your interest in contributing to the White Caves Real Estate Database project!

## How to Contribute

### Reporting Issues

If you find a bug or have a suggestion:

1. Check if the issue already exists in the GitHub Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Your environment details (MongoDB version, Node.js version)

### Suggesting Enhancements

We welcome suggestions for new features:

1. Open an issue with the "enhancement" label
2. Describe the feature and its use case
3. Explain why it would be valuable
4. Provide examples if possible

### Code Contributions

#### Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/White-Caves-DB.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install`
5. Make your changes

#### Coding Standards

- Follow existing code style and structure
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions focused and modular
- Test your changes thoroughly

#### Schema Changes

When modifying schemas:

1. Update the JSON schema file in `schemas/`
2. Update the corresponding seed data in `seed-data/`
3. Update indexes in `config/indexes.js` if needed
4. Update the DATABASE_DESIGN.md documentation
5. Add migration notes if breaking changes

#### Documentation

- Update README.md if adding new features
- Update QUICK_REFERENCE.md for new query patterns
- Add examples to `examples/` directory
- Keep comments up to date

#### Commit Messages

Use clear, descriptive commit messages:

```
Add user preferences filtering feature

- Implement preference-based property search
- Add new indexes for preferences
- Update documentation
```

#### Submitting Pull Requests

1. Ensure your code follows the project style
2. Update documentation as needed
3. Test your changes
4. Push to your fork: `git push origin feature/your-feature-name`
5. Create a Pull Request with:
   - Clear title and description
   - Reference any related issues
   - List of changes made
   - Screenshots (if applicable)

### Code Review Process

- All submissions require review
- We may suggest changes or improvements
- Once approved, your PR will be merged
- Your contribution will be credited

## Development Setup

### Prerequisites

- Node.js 14.x or higher
- MongoDB 6.x or higher
- Git

### Local Development

```bash
# Clone the repository
git clone https://github.com/arslan9024/White-Caves-DB.git
cd White-Caves-DB

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your MongoDB connection

# Set up database
npm run setup
```

### Testing

Before submitting:

1. Test with sample data
2. Verify indexes are created
3. Run example queries
4. Check for syntax errors
5. Validate JSON schemas

## Areas for Contribution

### Priority Areas

- Additional property types and categories
- Advanced search and filtering features
- Performance optimizations
- Additional analytics queries
- Integration examples (REST API, GraphQL)
- Migration scripts
- Backup/restore utilities
- Data validation improvements

### Documentation

- More query examples
- Video tutorials
- Best practices guide
- Troubleshooting guide
- Performance tuning guide

### Tooling

- Database migration tools
- Data import/export utilities
- Testing framework
- CI/CD pipeline
- Monitoring and alerting

## Questions?

Feel free to:

- Open an issue for questions
- Contact the maintainers
- Check existing documentation

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn and grow

## License

By contributing, you agree that your contributions will be licensed under the same ISC License that covers the project.

---

Thank you for contributing to White Caves Real Estate Database! 🏢
